import mongoose from 'mongoose';
import PostDataSchema from '../model/postData.js';

export async function updateValorantPosts() {
    try {
        const ValorantPost = mongoose.model(
            'Valorant',
            PostDataSchema,
            'Valorant',
        );

        const posts = await ValorantPost.find({});

        console.log(`Found ${posts.length} Valorant documents to update`);

        for (let post of posts) {
            post.Username = post.Username || 'Anonymous';
            post.lineupLocationCoords = post.lineupLocationCoords || {};
            post.lineupLocationCoords.x = post.lineupLocationCoords.x || 0;
            post.lineupLocationCoords.y = post.lineupLocationCoords.y || 0;
            post.lineupLocationCoords.name =
                post.lineupLocationCoords.name || 'Unknown';
            post.lineupPositionCoords = post.lineupPositionCoords || {};
            post.lineupPositionCoords.x = post.lineupPositionCoords.x || 0;
            post.lineupPositionCoords.y = post.lineupPositionCoords.y || 0;

            post.valorantAgent = post.valorantAgent || 'Unknown Agent';
            post.ability = post.ability || 'Unknown Ability';

            post.views = post.views || 0;
            post.jumpThrow = post.jumpThrow !== undefined ? post.jumpThrow : false;
            post.approved = post.approved !== undefined ? post.approved : false;
            post.lineupLocation = post.lineupLocation || 'Unknown';
            post.lineupDescription = post.lineupDescription || 'No description';
            post.teamSide = post.teamSide || 'Unknown';
            post.comments = post.comments || [];
            post.reports = post.reports || [];
            post.game = 'Valorant';

            if ('grenadeType' in post) {
                delete post.grenadeType;
            }

            await ValorantPost.updateOne({ _id: post._id }, post, {
                runValidators: false,
            });
            console.log(`Updated Valorant post: ${post._id}`);
        }

        console.log('All Valorant posts have been updated');
    } catch (error) {
        console.error('Error updating Valorant posts:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}

export async function updateCS2Posts() {
    try {
        const CS2Post = mongoose.model('CS2', PostDataSchema, 'CS2');

        const posts = await CS2Post.find({});

        console.log(`Found ${posts.length} documents to update`);

        for (let post of posts) {

            post.Username = post.Username || 'Anonymous';
            post.lineupLocationCoords = post.lineupLocationCoords || {};
            post.lineupLocationCoords.x = post.lineupLocationCoords.x || 0;
            post.lineupLocationCoords.y = post.lineupLocationCoords.y || 0;
            post.lineupLocationCoords.name =
                post.lineupLocationCoords.name || 'Unknown';
            post.lineupPositionCoords = post.lineupPositionCoords || {};
            post.lineupPositionCoords.x = post.lineupPositionCoords.x || 0;
            post.lineupPositionCoords.y = post.lineupPositionCoords.y || 0;

            post.views = post.views || 0;
            post.grenadeType = post.grenadeType || 'Default';
            post.jumpThrow = post.jumpThrow !== undefined ? post.jumpThrow : false;
            post.approved = post.approved !== undefined ? post.approved : false;
            post.lineupLocation = post.lineupLocation || 'Unknown';
            post.lineupDescription = post.lineupDescription || 'No description';
            post.teamSide = post.teamSide || 'Unknown';
            post.comments = post.comments || [];
            post.reports = post.reports || [];
            post.game = 'CS2';

            await CS2Post.updateOne({ _id: post._id }, post, {
                runValidators: false,
            });
            console.log(`Updated post: ${post._id}`);
        }

        console.log('All CS2 posts have been updated');
    } catch (error) {
        console.error('Error updating CS2 posts:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    }
}
